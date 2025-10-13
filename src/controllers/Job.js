import { asyncHandler } from "../utils/asyncHandler.js";
import Job from "../models/Job.js";
import Admin from "../models/Admin.js";
import imageToBase64 from "../utils/imageToBase64.js";

// Add job Admin
export const addJobAdmin = asyncHandler(async (req, res) => {
  const job = await Job.create({
    ...req.body,
    package: "Admin",
  });

  res.status(201).json({
    message: "Job added successfully",
    job,
  });
});

// get all jobs
export const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find()
    .select("title experience salary type companyId package")
    .populate("country", "name")
    .populate("state", "name")
    .populate("city", "name")
    .populate("companyId", "name logo"); // <- Company ke fields yaha do

  // convert populated objects into plain strings
  const formattedJobs = jobs.map((job) => ({
    _id: job._id,
    title: job.title,
    experience: job.experience,
    salary: job.salary,
    type: job.type,
    country: job.country?.name || null,
    state: job.state?.name || null,
    city: job.city?.name || null,
    package: job.package || null,
    company: job.companyId
      ? {
          _id: job.companyId._id,
          name: job.companyId.name,
          logo: imageToBase64(job.companyId.logo),
        }
      : null,
  }));

  res.json(formattedJobs);
});

// get job by id
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  res.json(job);
});

// delete job by id
export const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findByIdAndDelete(id);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }
  res.json({ message: "Job deleted", job });
});

// update job by id (id from body)
export const updateJob = asyncHandler(async (req, res) => {
  const { id, ...updateData } = req.body; // id alag nikala, baki fields update ke liye

  const job = await Job.findByIdAndUpdate(id, updateData, { new: true });

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }
  res.json({
    message: "Job updated successfully",
    job,
  });
});

// add usar job
export const addJobUser = asyncHandler(async (req, res) => {
  // Token se userId mila hoga (middleware se)
  const userId = req.admin?._id;

  // Admin/User fetch karo
  const user = await Admin.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role !== "user") {
    return res.status(403).json({ message: "Only users can post jobs" });
  }

  if (!user.companyId) {
    return res
      .status(400)
      .json({ message: "User does not have a company assigned" });
  }

  // Job create karo with user ka companyId
  const job = await Job.create({
    ...req.body,
    companyId: user.companyId,
  });

  res.status(201).json({
    message: "Job added successfully",
    job,
  });
});

// get all jobs by user
export const getAllJobsByUser = asyncHandler(async (req, res) => {
  const userId = req.admin?._id;
  const user = await Admin.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role !== "user") {
    return res.status(403).json({ message: "Only users can view their jobs" });
  }

  if (!user.companyId) {
    return res
      .status(400)
      .json({ message: "User does not have a company assigned" });
  }

  const jobs = await Job.find({ companyId: user.companyId }).select(
    "title experience salary type companyId package"
  );
  res.json(
    jobs.map((job) => ({
      _id: job._id,
      title: job.title,
      experience: job.experience,
      salary: job.salary,
      type: job.type,
      package: job.package || null,
    }))
  );
});

// get all job for public api
export const getAllJobbyJobBord = asyncHandler(async (req, res) => {
  const jobs = await Job.find()
    .select("title experience salary type companyId package salary field createdAt description workingHours shift flexibleWorkingHours noticePeriod bondTime benefits ")
    .populate("country", "name")
    .populate("state", "name")
    .populate("city", "name")
    .populate("companyId", "name logo type website phone email address");
  // convert populated objects into plain strings  >>     
  
  const formattedJobs = jobs.map((job) => ({
    _id: job._id,
    title: job.title,
    location:`${job?.city?.name}, ${job?.state?.name}, ${job?.country?.name}`,
    type: job.type,
    salary: job.salary,
    category: job.field,
    posted: job.createdAt,
    urgent:  job.package === "Paletiniyam"  ,
    package: job.package,
    featured: job.package === "Gold" ||  job.package === "Paletiniyam",
    description: job.description,
    requirements: [ {
     workingHours:  job?.workingHours,
     shift:job.shift ,
       flexibleWorkingHours:job.flexibleWorkingHours,
       noticePeriod: job.noticePeriod, 
       bondTime: job.bondTime
      } ],
    benefits: job.benefits,
    experienceLevel: job.experience,
    education: `Your education level will be decided by the ${job.companyId.name} company interview team.`,
    companyid:job.companyId._id,
    companyName: job.companyId.name,
    companyType: job.companyId.type,
    companyWebsite: job.companyId.website,
    companyPhone: job.companyId.phone,
    companyEmail: job.companyId.email,
    companyEddress: job.companyId.address,
    companyLogo: imageToBase64(job.companyId.logo),
  }));

  res.json(formattedJobs);
});
