import express = require("express"); 
import { User } from "../src/types/User";

declare global {
  // We make the namespace available globally so we do not have to import this file
  // To access our custom declarations
  // Avoid doing this in general, usually libraries structure their types in a better way
  namespace Express {
      interface Request {
          user?: User
      }
    interface Response {
      success: (payload: object) => void;
      failure: (error: string) => void;
    }
  }
}