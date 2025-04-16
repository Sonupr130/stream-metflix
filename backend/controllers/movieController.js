import Movie from '../models/Movies.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


 
// Add a new movie ORIGINLA CONTROLLER


// export const addMovie = async (req, res) => {
//   try {
//     const { title, description, category, year, directUrl, coverImageUrl, megaFileId } = req.body;
    
//     let coverImagePath = '';
    
//     // Handle file upload if exists
//     if (req.file) {
//       const fileExt = path.extname(req.file.originalname);
//       const fileName = `${Date.now()}${fileExt}`;
//       coverImagePath = `/uploads/${fileName}`;
      
//       // Move the file to uploads directory
//       fs.renameSync(req.file.path, path.join(uploadDir, fileName));
//     } 
//     // Use URL if provided and no file was uploaded
//     else if (coverImageUrl) {
//       coverImagePath = coverImageUrl;
//     }
//     // Default image if neither file nor URL provided
//     else {
//       coverImagePath = 'https://user-images.githubusercontent.com/582516/98960633-6c6a1600-24e3-11eb-89f1-045f55a1e494.png'; // Your default image path
//     }

//     if (!megaFileId) {
//       return res.status(400).json({ error: "MEGA File ID is required" });
//     }

//     const movie = new Movie({
//       title,
//       description,
//       category,
//       year,
//       directUrl,
//       megaFileId,
//       coverImage: coverImagePath
//     });

//     await movie.save();
//     res.status(201).json(movie);
//   } catch (error) {
//     console.error('Error adding movie:', error);
//     res.status(500).json({ error: 'Failed to add movie' });
//   }
// };


export const addMovie = async (req, res) => {
  try {
    const { title, description, category, year, directUrl, coverImageUrl, megaFileId } = req.body;
    
    let coverImagePath = '';
    
    // Handle file upload if exists (memory storage)
    if (req.file) {
      // With memory storage, req.file contains a buffer instead of a path
      const fileExt = path.extname(req.file.originalname);
      const fileName = `${Date.now()}${fileExt}`;
      
      // In a real application, you would upload this buffer to cloud storage here
      // For example, if using AWS S3, Cloudinary, or another service
      // Since we can't save to disk in serverless, we'll either:
      // 1. Use the provided coverImageUrl if available
      // 2. Fall back to default image
      // 3. Or implement actual cloud storage upload (commented example)
      
      /* Example for Cloudinary upload (uncomment and implement if you have it set up):
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        { folder: 'movie-covers' }
      );
      coverImagePath = result.secure_url;
      */
      
      // Temporary solution until you implement cloud storage:
      coverImagePath = coverImageUrl || 'https://user-images.githubusercontent.com/582516/98960633-6c6a1600-24e3-11eb-89f1-045f55a1e494.png';
      
      console.log('File uploaded in memory (not saved to disk)', {
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } 
    // Use URL if provided and no file was uploaded
    else if (coverImageUrl) {
      coverImagePath = coverImageUrl;
    }
    // Default image if neither file nor URL provided
    else {
      coverImagePath = 'https://user-images.githubusercontent.com/582516/98960633-6c6a1600-24e3-11eb-89f1-045f55a1e494.png';
    }

    if (!megaFileId) {
      return res.status(400).json({ error: "MEGA File ID is required" });
    }

    const movie = new Movie({
      title,
      description,
      category,
      year,
      directUrl,
      megaFileId,
      coverImage: coverImagePath
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ error: 'Failed to add movie' });
  }
};


// Search movies
export const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const movies = await Movie.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } })
     .limit(10);

    res.json(movies);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ error: 'Failed to search movies' });
  }
};

// Get all movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};

// get movies by category
export const getMoviesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    const movies = await Movie.find(query).sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};



