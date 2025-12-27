// API for adding doctor
const addDoctor = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address
        } = req.body;

        const imageFile = req.file;

        console.log("Received Form Data:");
        console.log("name:", name);
        console.log("email:", email);
        console.log("password:", password);
        console.log("speciality:", speciality);
        console.log("degree:", degree);
        console.log("experience:", experience);
        console.log("about:", about);
        console.log("fees:", fees);
        console.log("address:", address);

        console.log("\nReceived Image File Info:");

        if (imageFile) {
            console.log("fieldname:", imageFile.fieldname);
            console.log("originalname:", imageFile.originalname);
            console.log("encoding:", imageFile.encoding);
            console.log("mimetype:", imageFile.mimetype);
            console.log("destination:", imageFile.destination);
            console.log("filename:", imageFile.filename);
            console.log("path:", imageFile.path);
            console.log("size:", imageFile.size, "bytes");
        } else {
            console.log("No image file received");
        }

        res.status(200).json({
            success: true,
            message: "Doctor data received successfully",
            data: {
                name,
                email,
                speciality,
                degree,
                experience,
                about,
                fees,
                address,
                imageInfo: imageFile
                        ? {
                            fieldname: imageFile.fieldname,
                            originalname: imageFile.originalname,
                            encoding: imageFile.encoding,
                            mimetype: imageFile.mimetype,
                            destination: imageFile.destination,
                            filename: imageFile.filename,
                            path: imageFile.path,
                            size: imageFile.size
                        }
                    : null
            }
        });

    } catch (error) {
        console.error("Error in addDoctor API:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export { addDoctor };
