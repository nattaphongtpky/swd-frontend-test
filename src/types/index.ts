export interface User {
  id: string;
  gender: "male" | "female" | "other";
  title: string;
  firstname: string;
  lastname: string;
  birthday: string;
  nationality: string;
  citizenid: string;
  phone: string;
  passport: string;
  salary: string;
}

export interface UserState {
  users: User[];
  formData: {
    id: string | null;
    gender: "male" | "female" | "other";
    title: string;
    firstname: string;
    lastname: string;
    birthday: string;
    nationality: string;
    citizenid: string;
    phone: string;
    passport: string;
    salary: string;
  };
  isLoaded: boolean;
}
