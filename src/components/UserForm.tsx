import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import "../style.css";
import { useNavigate } from "react-router-dom";
import { User } from "../types/User";
import { v4 as uuidv4 } from "uuid";
import { addUserAsync } from "../features/users/userSlice";
import { useAppDispatch } from "../hooks/hooks";

const schema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .max(30, "Maximum 30 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .max(30, "Maximum 30 characters"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must be numeric")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits"),
  address: yup
    .string()
    .required("Address is required")
    .max(100, "Maximum 100 characters"),
  age: yup
    .number()
    .required("Age is required")
    .min(18, "Must be at least 18 years old"),
});

const UserForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<User> = (data) => {
    const newUser = { ...data, id: uuidv4() };
    dispatch(addUserAsync(newUser));
    navigate("/");
  };

  return (
    <div>
      <h2>User Information Form</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>First Name:</label>
          <input {...register("firstName")} />
          <p>{errors.firstName?.message}</p>
        </div>
        <div>
          <label>Last Name:</label>
          <input {...register("lastName")} />
          <p>{errors.lastName?.message}</p>
        </div>
        <div>
          <label>Email:</label>
          <input {...register("email")} />
          <p>{errors.email?.message}</p>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" {...register("password")} />
          <p>{errors.password?.message}</p>
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" {...register("confirmPassword")} />
          <p>{errors.confirmPassword?.message}</p>
        </div>
        <div>
          <label>Phone Number:</label>
          <input {...register("phoneNumber")} />
          <p>{errors.phoneNumber?.message}</p>
        </div>
        <div>
          <label>Address:</label>
          <input {...register("address")} />
          <p>{errors.address?.message}</p>
        </div>
        <div>
          <label>Age:</label>
          <input type="number" {...register("age")} />
          <p>{errors.age?.message}</p>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserForm;
