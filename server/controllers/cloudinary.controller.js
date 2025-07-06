import { v2 as cloudinary } from 'cloudinary';

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

const cldUpload = async (imagePath) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        folder: 'taskzy-avatars',
    };

    try {
        const result = await cloudinary.uploader.upload(imagePath, options);
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

export const addImage = async (req, res, next) => {
    try {
        // Check if image file exists
        if (!req.files || !req.files.image) {
            return res.status(400).json({
                status: 'error',
                message: 'No image file provided'
            });
        }

        const { data, mimetype } = req.files.image;

        // Validate file type
        if (!mimetype.startsWith('image/')) {
            return res.status(400).json({
                status: 'error',
                message: 'File must be an image'
            });
        }

        // Convert to base64
        const base64String = Buffer.from(data).toString('base64');
        const withPrefix = `data:${mimetype};base64,${base64String}`;

        // Upload to Cloudinary
        const imageUrl = await cldUpload(withPrefix);

        return res.status(200).json({
            status: 'success',
            imageUrl,
            message: 'Image uploaded successfully'
        });

    } catch (error) {
        console.error('Image upload error:', error);
        next({
            status: 500,
            error: error.message || 'Image upload failed'
        });
    }
};