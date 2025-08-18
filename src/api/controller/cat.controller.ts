import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/database";
import { sendJson } from "../../utils";
import { CatPost } from "../../utils/type";

// Create Cat
export const createCat = async (req: Request, res: Response) => {
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
  }: CatPost = req.body;

  if (!catOwnerId || !catName) {
    return sendJson(
      res,
      "catPost",
      null,
      {
        message: "catOwnerId and catName are required",
        error: true,
      },
      400
    );
  }

  const id = uuidv4();
  const adoptedInt = adopted ? 1 : 0;

  await db`
    INSERT INTO cats (
      id, cat_owner_id, cat_name, cat_image, cat_age, cat_gender, cat_description,
      owner_name, owner_address, owner_phone, owner_email, adopted, additional_information
    ) VALUES (
      ${id}, ${catOwnerId}, ${catName}, ${catImage}, ${catAge}, ${catGender}, ${catDescription},
      ${ownerName}, ${ownerAddress}, ${ownerPhone}, ${ownerEmail}, ${adoptedInt}, ${additionalInformation}
    )`;

  sendJson(
    res,
    "catPost",
    { id, ...req.body },
    {
      message: "Cat posted for adoption",
    }
  );
};

// Get Cat
export const getCats = async (req: Request, res: Response) => {
  const cats =
    await db`SELECT * FROM cats WHERE adopted = 0 AND is_approved = 1`;
  sendJson(res, "cats", cats, { message: "Cats retrieved successfully" });
};

// Get Cats by Admin

export const getCatsAdmin = async (req: Request, res: Response) => {
  const cats = await db`SELECT * FROM cats`;
  sendJson(res, "cats", cats, { message: "Cats retrieved successfully" });
};

// Get Cat by Id
export const getCatById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cat = await db`SELECT * FROM cats WHERE id = ${id}`.then((r) => r[0]);
  if (!cat) {
    return sendJson(
      res,
      "cat",
      null,
      {
        message: "Cat not found",
        error: true,
      },
      404
    );
  }
  sendJson(res, "cat", cat, { message: "Cat retrieved successfully" });
};

export const getCatsByOwner = async (req: Request, res: Response) => {
  const { owner_id } = req.params;
  const cats = await db`SELECT * FROM cats WHERE cat_owner_id = ${owner_id}`;
  sendJson(res, "cats", cats, { message: "Cats retrieved successfully" });
};

export const updateCat = async (req: Request, res: Response) => {
  const { cat_id } = req.params;

  // fetch the current cat first
  const existingCat = await db`SELECT * FROM cats WHERE id = ${cat_id}`.then(
    (r) => r[0]
  );
  if (!existingCat) {
    return sendJson(
      res,
      "cat",
      null,
      { message: "Cat not found", error: true },
      404
    );
  }

  // use new values if provided, otherwise fallback to existing
  const {
    catName = existingCat.cat_name,
    catImage = existingCat.cat_image,
    catAge = existingCat.cat_age,
    catGender = existingCat.cat_gender,
    catDescription = existingCat.cat_description,
    ownerAddress = existingCat.owner_address,
    ownerPhone = existingCat.owner_phone,
    ownerEmail = existingCat.owner_email,
    adopted = existingCat.adopted,
    isApproved = existingCat.is_approved, // 0 | 1 | 2
    additionalInformation = existingCat.additional_information,
  } = req.body;

  await db`
    UPDATE cats SET 
      cat_name = ${catName},
      cat_image = ${catImage},
      cat_age = ${catAge},
      cat_gender = ${catGender},
      cat_description = ${catDescription},
      owner_address = ${ownerAddress},
      owner_phone = ${ownerPhone},
      owner_email = ${ownerEmail},
      adopted = ${adopted ? 1 : 0},
      is_approved = ${isApproved},
      additional_information = ${additionalInformation}
    WHERE id = ${cat_id}`;

  sendJson(res, "cat", { id: cat_id }, { message: "Cat updated successfully" });
};

export const deleteCat = async (req: Request, res: Response) => {
  const { cat_id } = req.params;
  await db`DELETE FROM cats WHERE id = ${cat_id}`;
  sendJson(res, "cat", { id: cat_id }, { message: "Cat deleted successfully" });
};
