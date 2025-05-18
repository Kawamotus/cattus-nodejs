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
    return Activity.findById(id).populate('activityAuthor');
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
}

export default new ActivityServices();
