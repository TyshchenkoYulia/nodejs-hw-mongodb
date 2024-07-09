import Contact from '../db/models/сontact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({
  filterIsFavourite = {},
  page = 1,
  perPage = 10,
  sortBy,
  sortOrder,
}) => {
  const skip = (page - 1) * perPage;

  const dataQuery = Contact.find();

  if (filterIsFavourite.isFavourite) {
    dataQuery.where('isFavourite').equals(filterIsFavourite.isFavourite);
  }

  const data = await dataQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const totalItems = await Contact.find().merge(dataQuery).countDocuments();
  const { totalPages, hasPreviousPage, hasNextPage } = calcPaginationData({
    total: totalItems,
    page,
    perPage,
  });

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const getContactById = (id) => Contact.findById(id);

export const addContact = (data) => Contact.create(data);

export const updateContact = async (filter, data, options = {}) => {
  const result = await Contact.findOneAndUpdate(filter, data, {
    includeResultMetadata: true,
    ...options,
  });

  if (!result || !result.value) return null;

  const isNew = Boolean(result?.lastErrorObject?.upserted);

  return {
    data: result.value,
    isNew,
  };
};

export const deleteContact = (filter) => Contact.findOneAndDelete(filter);
