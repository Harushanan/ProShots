import React from 'react'
import { toast } from 'sonner';

const CheckAddPackage = (formDetails) => {
    if (formDetails.sessionPeriod <= 0 || formDetails.sessionPeriod >= 20) {
        toast.error("Session period must be between 1 and 19.", {
            action: {
                label: "Close",
                onClick: () => toast.dismiss()
            },
            duration: 5000
        })
        return false;
    } else if( formDetails.packageHead.length > 25 && formDetails.packageHead.length < 10 ) {
        toast.error("Invalid Package head : Please enter character between 10 to 25.", {
            action: {
                label: "Close",
                onClick: () => toast.dismiss()
            },
            duration: 5000
        });
    
        return false;
    } else if( formDetails.packageSubhead.length > 25 && formDetails.packageSubhead.length < 10 ) {
        toast.error("Invalid sub Package head : Please enter character between 10 to 25.", {
            action: {
                label: "Close",
                onClick: () => toast.dismiss()
            },
            duration: 5000
        });
    
        return false;
    } else if (formDetails.price < 3000 || formDetails.price > 500000) {
        toast.error("Price must be between 3,000 and 500,000.", {
            action: {
                label: "Close",
                onClick: () => toast.dismiss()
            },
            duration: 5000
        });
    
        return false;
    } else if (formDetails.noOfCameraman <= 0 || formDetails.noOfCameraman >= 10) {
        toast.error("Number of cameramen must be between 1 and 9.", {
            action: {
                label: "Close",
                onClick: () => toast.dismiss()
            },
            duration: 5000
        });
    
        return false;
    } else if (formDetails.photoCount < 10 || formDetails.photoCount > 300) {
        toast.error("Photo count must be between 10 and 300.", {
            action: {
                label: "Close",
                onClick: () => toast.dismiss()
            },
            duration: 5000
        });
    
        return false;
    }

    return true;
}

export default CheckAddPackage;