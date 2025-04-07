import About from '../models/aboutModel.js';

export const getAbout = async (req, res) => {
  try {
    const aboutInfo = await About.findOne();
    res.json(aboutInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


export const createOrUpdateAbout = async (req, res) => {
  const { images, videos, text } = req.body;

  try {
    // Check if an about document already exists; if yes, update it; if not, create a new one
    let aboutInfo = await About.findOne();

    if (!aboutInfo) {
      aboutInfo = new About({ images: [], videos: [], text });
    } else {
      // Update text
      aboutInfo.text = text;
    }

    // Process and save uploaded images
    if (req.files && req.files.images) {
      req.files.images.forEach((image) => {
        aboutInfo.images.push({ url: image.path });
      });
    }

    // Process and save uploaded videos
    if (req.files && req.files.videos) {
      req.files.videos.forEach((video) => {
        aboutInfo.videos.push({ url: video.path });
      });
    }

    await aboutInfo.save();

    res.json({ success: true, message: 'About information updated successfully', aboutInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete image from about information
// @route   DELETE /api/about/deleteImage/:imageUrl
// @access  Private (You can update this based on your authentication logic)
export const deleteImage = async (req, res) => {
  const imageUrl = req.params.imageUrl;

  try {
    const aboutInfo = await About.findOne();
    if (!aboutInfo) {
      return res.status(404).json({ success: false, message: 'About information not found' });
    }

    // Find the index of the image with the given URL and remove it
    const imageIndex = aboutInfo.images.findIndex((image) => image.url === imageUrl);
    if (imageIndex !== -1) {
      aboutInfo.images.splice(imageIndex, 1);
      await aboutInfo.save();
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Image not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete video from about information
// @route   DELETE /api/about/deleteVideo/:videoUrl
// @access  Private (You can update this based on your authentication logic)
export const deleteVideo = async (req, res) => {
  const videoUrl = req.params.videoUrl;

  try {
    const aboutInfo = await About.findOne();
    if (!aboutInfo) {
      return res.status(404).json({ success: false, message: 'About information not found' });
    }

    // Find the index of the video with the given URL and remove it
    const videoIndex = aboutInfo.videos.findIndex((video) => video.url === videoUrl);
    if (videoIndex !== -1) {
      aboutInfo.videos.splice(videoIndex, 1);
      await aboutInfo.save();
      res.json({ success: true, message: 'Video deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Video not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
