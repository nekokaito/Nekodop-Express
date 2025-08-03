import type { Request, Response } from "express";
import { db } from "../db/neonClient";
import { v4 as uuidv4 } from "uuid";
import type { Controller } from "../utils/controllerWrapper";

export const createCat: Controller = async ({ req, res }) => {
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
  } = req.body;

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

  res.json({ message: "Cat posted for adoption", catPost: req.body });
};

export const getCats: Controller = async ({ req, res }) => {
  const cats =
    await db`SELECT * FROM cats WHERE adopted = 0 AND is_approved = 1`;
  res.json({ message: "Cats retrieved successfully", cats });
};

export const getCatsAdmin: Controller = async ({ req, res }) => {
  const cats = await db`SELECT * FROM cats`;
  res.json({ message: "Cats retrieved successfully", cats });
};

export const getCatById: Controller = async ({ req, res }) => {
  const { id } = req.params;
  const cat = await db`SELECT * FROM cats WHERE id = ${id}`.then((r) => r[0]);
  if (!cat) return res.status(404).json({ message: "Cat not found" });
  res.json({ message: "Cat retrieved successfully", cat });
};

export const getCatsByOwner: Controller = async ({ req, res }) => {
  const { owner_id } = req.params;
  const cats = await db`SELECT * FROM cats WHERE cat_owner_id = ${owner_id}`;
  res.json({ message: "Cats retrieved successfully", cats });
};

export const updateCat: Controller = async ({ req, res }) => {
  const { cat_id } = req.params;
  const {
    catName,
    catImage,
    catAge,
    catGender,
    catDescription,
    ownerAddress,
    ownerPhone,
    ownerEmail,
    adopted,
    isApproved,
    additionalInformation,
  } = req.body;


  const adoptedInt = adopted ? 1 : 0;
  const isApprovedInt = isApproved ? 1 : 0;

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
      adopted = ${adoptedInt},
      is_approved = ${isApprovedInt},
      additional_information = ${additionalInformation}
    WHERE id = ${cat_id}`;

  res.json({ message: "Cat updated successfully" });
};

export const deleteCat: Controller = async ({ req, res }) => {
  const { cat_id } = req.params;
  await db`DELETE FROM cats WHERE id = ${cat_id}`;
  res.json({ message: "Cat deleted successfully" });
};
