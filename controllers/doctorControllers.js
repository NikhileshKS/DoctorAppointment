import doctorModel from "../models/doctorModel.js";

const changeAvaliabity = async (req, res) => {

    try {
        
        const { docId } = req.body;

        const docData = await doctorModel.findById(docId);

        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });

        return res.status(200).json({ success: true, message: "Doctor availability changed successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "changeAvaliabity Error" });
    }
}

export { changeAvaliabity };