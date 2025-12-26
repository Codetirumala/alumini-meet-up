const Job = require('../models/Job');

// Alumni posts a job
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({
      postedBy: req.user._id,
      ...req.body
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all jobs (students & alumni)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('postedBy', 'name email')
      .populate({
        path: 'postedBy',
        populate: {
          path: 'alumniProfile',
          select: 'currentCompany batchYear'
        }
      })
      .sort({ createdAt: -1 });

    // Transform jobs to include alumni details in postedBy
    const jobsWithAlumniDetails = jobs.map(job => {
      const jobObj = job.toObject();
      if (jobObj.postedBy && jobObj.postedBy.alumniProfile) {
        jobObj.postedBy = {
          _id: jobObj.postedBy._id,
          name: jobObj.postedBy.name,
          company: jobObj.postedBy.alumniProfile.currentCompany || 'Not specified',
          batch: jobObj.postedBy.alumniProfile.batchYear || 'N/A'
        };
      } else {
        jobObj.postedBy = {
          _id: jobObj.postedBy._id,
          name: jobObj.postedBy.name,
          company: 'Not specified',
          batch: 'N/A'
        };
      }
      return jobObj;
    });

    res.json(jobsWithAlumniDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student applies for job
exports.applyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.applicants.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already applied' });
    }

    job.applicants.push(req.user._id);
    await job.save();

    res.json({ message: 'Applied successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get alumni's own posted jobs
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate('applicants', 'name email')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a job post (alumni only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the job belongs to the logged-in alumni
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
