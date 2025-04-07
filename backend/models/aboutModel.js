import mongoose from 'mongoose';

const aboutSchema = mongoose.Schema(
  {
    images: [{
      url: { type: String, required: true }
    }],
    videos: [{
      url: { type: String, required: true }
    }],
    text: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

const About = mongoose.model('About', aboutSchema);

export default About;
