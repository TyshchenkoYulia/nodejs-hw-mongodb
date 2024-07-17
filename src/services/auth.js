import User from '../db/models/user.js';

export const findUser = (filter) => User.findOne(filter);
export const signup = async (data) => User.create(data);
