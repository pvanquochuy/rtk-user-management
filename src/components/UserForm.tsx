import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import "../style.css";
import { User } from "../types/User";
import { v4 as uuidv4 } from "uuid";
import { useUsers } from "../hooks/useUsers";
import { RootState } from "../states/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const selectedUser = useSelector(
    (state: RootState) => state.users.selectedUser
  );

  const isEditMode = !!selectedUser;
  const { addMutation, updateMutation } = useUsers();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
  } = useForm<User>({
    resolver: yupResolver(schema),
    defaultValues: selectedUser || {},
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<User> = (data) => {
    if (isEditMode) {
      //update
      updateMutation.mutate(
        {
          userId: selectedUser?.id ?? "",
          updatedUser: { ...data },
        },
        {
          onSuccess: () => {
            navigate("/");
          },
          onError: (error) => {
            console.log("Error updating user: ", error);
          },
        }
      );
    } else {
      // add user
      const newUser = { ...data, id: uuidv4() };

      addMutation.mutate(newUser, {
        onSuccess: () => {
          navigate("/");
          console.log("Form submitted!");
        },
        onError: (error) => {
          console.error("Error adding user:", error);
        },
      });
    }
  };

  useEffect(() => {
    if (isEditMode && selectedUser) {
      reset(selectedUser);
    }
  }, [isEditMode, selectedUser, reset]);

  return (
    <div>
      <h2>{isEditMode ? "Edit USer" : "Add User"}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            {...register("firstName")}
            onBlur={(): Promise<boolean> => trigger("firstName")}
          />
          <p>{errors.firstName?.message}</p>
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input id="lastName" {...register("lastName")} />
          <p>{errors.lastName?.message}</p>
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input id="email" {...register("email")} />
          <p>{errors.email?.message}</p>
        </div>
        <div>
          <label htmlFor="password">password:</label>
          <input
            id="password"
            type="password"
            aria-label="Password"
            {...register("password")}
          />
          <p>{errors.password?.message}</p>
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            type="password"
            aria-label="Confirm Password"
            {...register("confirmPassword")}
          />
          <p>{errors.confirmPassword?.message}</p>
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input id="phoneNumber" {...register("phoneNumber")} />
          <p>{errors.phoneNumber?.message}</p>
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input id="address" {...register("address")} />
          <p>{errors.address?.message}</p>
        </div>
        <div>
          <label htmlFor="age">Age:</label>
          <input id="age" type="number" {...register("age")} />
          <p>{errors.age?.message}</p>
        </div>
        <button type="submit">{isEditMode ? "Update" : "Submit"}</button>
      </form>
    </div>
  );
};

export default UserForm;
