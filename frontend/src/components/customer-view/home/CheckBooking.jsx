import React from 'react';
import { toast } from 'sonner';



export const CheckBooking = (formDetails) => {

    if (formDetails.phoneNumber) {
        const phoneRegex = /^0[0-9]{9}$/;

        if (!phoneRegex.test(formDetails.phoneNumber)) {
            toast.error("Invalid phone number : Please enter a 10-digit phone number start with 0.", {
                action: {
                    label: "Close",
                    onClick: () => toast.dismiss()
                },
                duration: 5000
            });

            return false;
        }   
    }

    if (formDetails.eventDate) {
        const eventDate = new Date(formDetails.eventDate);
        const currentDate = new Date();
        const maxDate = new Date(currentDate);
        maxDate.setFullYear(maxDate.getFullYear() + 1);

        currentDate.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);


        if( eventDate <= currentDate ) {
            toast.error("Invalid Event Date : Please enter a valid date.", {
                action: {
                    label: "Close",
                    onClick: () => toast.dismiss()
                },
                duration: 5000
            });

            return false;
        } else if( eventDate > maxDate ) {
            toast.error("Invalid Event Date : Please enter a valid date within one year.", {
                action: {
                    label: "Close",
                    onClick: () => toast.dismiss()
                },
                duration: 5000
            });

            return false;
        }
    }
 
    if (!formDetails.eventType) {
        toast.error("Invalid Event Type : Please select valid event type", {
            action: {
                label: "Close",
                onClick: () => toast.dismiss()
            },
            duration: 5000
        });
        return false;
    }


    return true;
};  