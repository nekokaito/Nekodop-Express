import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/database";
import { sendJson } from "../utils";


export const createCat = async (req: Request, res: Response) => {
  const id = uuidv4();
  const {
    catOwnerId,
    catName,
    catImage,
    catAge,
    catGender,
    catDescription,
    ownerName,
    ownerAddress,
    ownerPhone,
    ownerEmail,
    adopted = false,
    additionalInformation,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: any = req.body;

  // Convert adopted to integer
  const adoptedInt = adopted ? 1 : 0;


  await db`
    INSERT INTO cats (
      id, cat_owner_id, cat_name, cat_image, cat_age, cat_gender, cat_description,
      owner_name, owner_address, owner_phone, owner_email, adopted, additional_information
    ) VALUES (
      ${id}, ${catOwnerId}, ${catName}, ${catImage}, ${catAge}, ${catGender}, ${catDescription},
      ${ownerName}, ${ownerAddress}, ${ownerPhone}, ${ownerEmail}, ${adoptedInt}, ${additionalInformation}
    )`;
  sendJson(res, 'catPost', req.body, {
    message: 'Cat posted for adoption',
  })

};

export const getCats = async (req: Request, res: Response) => {
  const cats =
    await db`SELECT * FROM cats WHERE adopted = 0 AND is_approved = 1`;

  sendJson(res, 'cats', cats, {
    message: "Cats retrieved successfully",
  })

};
