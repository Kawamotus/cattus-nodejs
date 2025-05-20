import mongoose from 'mongoose';
import activity from '../models/activity.js';
import utils from '../utils/utils.js';

const Activity = mongoose.model('activity', activity);

class ActivityServices {
  SelectAll(id) {
    return Activity.find({ activityAuthor: id })
      .populate('activityAuthor')
      .populate('activityCameraAuthor');
  }

  SelectAllByCamera(id) {
    return Activity.find({ activityCameraAuthor: id })
      .populate('activityAuthor')
      .populate('activityCameraAuthor');
  }

  SelectAllNoCriteria() {
    return Activity.find();
  }

  SelectAverageActivitiesTime(company, interval) {
    company = new mongoose.Types.ObjectId(company);
    return Activity.aggregate(
      utils.pipelineAverageActivitiesTime(company, interval),
    );
  }

  SelectOne(id) {
    return Activity.findById(id).populate('activityAuthor').populate('activityCameraAuthor');
  }

  Create(data) {
    const newActivity = new Activity(data);
    return newActivity.save();
  }

  Delete(id) {
    return Activity.findByIdAndDelete(id);
  }

  SelectByCameraId(cameraId) {
    return Activity.find({ activityCameraAuthor: cameraId })
      .populate('activityAuthor')
      .populate('activityCameraAuthor');
  }

  SelectByCompanyId(companyId) {
    return Activity.find()
      .populate({
        path: 'activityAuthor',
        match: { company: companyId },
        populate: {
          path: 'company',
        },
      })
      .populate('activityCameraAuthor')
      .then((activities) => {
        return activities.filter((activity) => activity.activityAuthor);
      });
  }

  // Preferivelmente usar esse pois vem cronológico e paginado
  SelectByCompanyIdPaginated(companyId, skip = 0, limit = 20) {
    return Activity.find()
      .populate({
        path: 'activityAuthor',
        match: { company: companyId },
        populate: {
          path: 'company',
        },
      })
      .populate('activityCameraAuthor')
      .sort({ 'activityData.activityStart': -1 })
      .then((activities) => {
        const filteredActivities = activities.filter(
          (activity) => activity.activityAuthor,
        );

        return filteredActivities.slice(skip, skip + limit);
      });
  }
}

export default new ActivityServices();
