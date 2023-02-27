import { getUsersCollection } from "@/services/getUsersCollection";
import { UserData } from "@/types";
import { Filter, FindOptions } from "mongodb";

async function findAllUsers(value?: Filter<UserData>, options?: FindOptions) {

  const usersCollection = await getUsersCollection()
  const allUsers = await usersCollection.findOne(value as UserData, options)

  return allUsers
}

export default findAllUsers