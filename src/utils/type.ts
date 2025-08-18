export interface CatPost {
  catOwnerId: string;
  catName: string;
  catImage: string;
  catAge: number;
  catGender: "male" | "female";
  catDescription: string;
  ownerName: string;
  ownerAddress: string;
  ownerPhone: string;
  ownerEmail: string;
  adopted?: boolean;
  isApproved: 0 | 1 | 2;
  additionalInformation?: string;
}
export interface User {
  userName: string;
  email: string;
  password: string;
  profilePicture: string;
}
