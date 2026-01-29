const addDoctor = async (req, res) => {
    try {   
    const {
        name,
        email,
        password,
        specialization,
        degree,
        experience,
        about,
        fees,
        address
    } = req.body;

    const imageFile = req.file;

    console.log(
        { name, email, password, specialization, degree, experience, about, fees, address },
        imageFile
    );

    if (!imageFile) {
        return res.status(400).json({ message: "Image not received" });
    }

    return res.json({
        message: "Doctor data + image received",
        imagePath: imageFile.path
    });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { addDoctor };
