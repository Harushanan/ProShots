const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const ItemCart = require('../../models/itemModel'); 

const PAT = process.env.CLARIFAI_PAT || "8025282668434a3baf1d17a2a35f0aed";
const USER_ID = process.env.CLARIFAI_USER_ID || "qwlwkp51kdc0";
const APP_ID = process.env.CLARIFAI_APP_ID || "ImageSearchApp";
const MODEL_ID = process.env.CLARIFAI_MODEL_ID || "general-image-recognition";
const SIMILARITY_THRESHOLD = 0.85; 

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${PAT}`);


const searchSimilarImages = async (req, res) => {
  try {
    const { imageBase64, imageId, targetProductType } = req.body; 

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: "No image provided" });
    }

    // Process base64 image
    const processedBase64 = imageBase64.startsWith('data:image/') 
      ? imageBase64.split(',')[1] 
      : imageBase64;

    // Get image recognition results
    const response = await new Promise((resolve, reject) => {
      stub.PostModelOutputs(
        {
          user_app_id: { user_id: USER_ID, app_id: APP_ID },
          model_id: MODEL_ID,
          inputs: [{ data: { image: { base64: processedBase64 } }}]
        },
        metadata,
        (err, response) => {
          if (err) reject(err);
          else resolve(response);
        }
      );
    });

    if (response.status.code !== 10000) {
      return res.status(502).json({ 
        success: false,
        error: "Image processing service unavailable"
      });
    }

    const allConcepts = response.outputs[0].data.concepts || [];
    
    // 1. First identify the main product category
    const productCategories = allConcepts
      .filter(c => c.name.toLowerCase().includes("product") || 
                  c.name.toLowerCase().includes("item type"))
      .sort((a, b) => b.value - a.value);

    const detectedProductType = productCategories.length > 0 
      ? productCategories[0].name.toLowerCase()
      : null;

    // 2. Filter concepts by both similarity AND product type
    const filteredConcepts = allConcepts
      .filter(c => {
        // First apply similarity threshold
        const meetsSimilarity = c.value > SIMILARITY_THRESHOLD;
        
        // Then check if concept matches the detected product type
        const matchesProductType = targetProductType 
          ? c.name.toLowerCase().includes(targetProductType)
          : detectedProductType
            ? c.name.toLowerCase().includes(detectedProductType)
            : true;
            
        return meetsSimilarity && matchesProductType;
      })
      .map(c => ({
        name: c.name.toLowerCase(),
        value: c.value,
      }));

    console.log("Filtered concepts by product type:", filteredConcepts);

    // Database operations (keep your existing code)
    if (imageId) {
      try {
        await ItemCart.findByIdAndUpdate(
          imageId,
          { $set: { imageFeatures: filteredConcepts } },
          { new: true }
        );
      } catch (dbError) {
        console.error("Database update error:", dbError);
      }
    }

    return res.json({
      success: true,
      concepts: filteredConcepts,
      detectedProductType,
      modelUsed: MODEL_ID,
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error",
    });
  }
};

module.exports = { searchSimilarImages };