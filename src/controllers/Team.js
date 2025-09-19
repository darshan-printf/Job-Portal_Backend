import { asyncHandler } from "../utils/asyncHandler.js";
import imageToBase64 from "../utils/imageToBase64.js";
import Team from "../models/Team.js";
import fs from "fs";
import path from "path";

// add team
export const addTeam = asyncHandler(async (req, res) => {
  // Get image paths
  const Image = req.files?.image?.[0]?.path || "";

  const team = await Team.create({
    name: req.body.name,
    description: req.body.description,
    designation: req.body.designation,
    image: Image,
  });

  res.status(201).json({
    message: "Team Member added successfully",
    team,
  });
});

// get all team
export const getAllTeam = asyncHandler(async (req, res) => {
  const team = await Team.find({});

   const teamWithBase64Images = team.map(team => {
        return {
            ...team.toObject(),
            image: team.image ? imageToBase64(team.image) : '',
            
        };
    });

  res.json(teamWithBase64Images);
});

// get team by id
export const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  const teamWithBase64Image = {
    ...team.toObject(),
    image: team.image ? imageToBase64(team.image) : '',
  };

  res.json(teamWithBase64Image);
});


// update team by id
export const updateTeam = asyncHandler(async (req, res) => {
  const { id, ...updateData } = req.body;

  // Check if team exists
  const team = await Team.findById(id);
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  // If new image uploaded
  if (req.files?.image?.[0]?.path) {
    const newImagePath = req.files.image[0].path;

    // Delete old image (if exists)
    if (team.image && fs.existsSync(team.image)) {
      fs.unlinkSync(team.image);
    }

    updateData.image = newImagePath;
  }

  const updatedTeam = await Team.findByIdAndUpdate(id, updateData, { new: true });

  res.json({
    message: "Team updated successfully",
    updatedTeam,
  });
});


// delete team by id
export const deleteTeam = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const team = await Team.findByIdAndDelete(id);
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }
  res.json({ message: "Team deleted successfully", team });
});
