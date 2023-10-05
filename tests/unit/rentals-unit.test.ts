import rentalsService from "services/rentals-service";
import { cleanDb } from "../utils";
import rentalsRepository from "repositories/rentals-repository";
import usersRepository from "repositories/users-repository";
import { describe } from "node:test";
import { User } from "@prisma/client";

beforeEach(() => {
  cleanDb();
  jest.clearAllMocks();
})

describe("Rentals Service Unit Tests", () => {
  describe('getRentalById', () => {
    it("should throw not found error when rental doesnt exist", async () => {
      jest.spyOn(rentalsRepository, 'finishRental').mockImplementationOnce((): any => {
        return undefined;
      });
  
      const result = rentalsService.getRentalById(1234);
  
      expect(result).rejects.toEqual({ 
        name: "NotFoundError",
        message: 'Rental not found.'
      });
    })

    it('should return a rental', async () => {
      const rentalMock = {
        id: 123,
        date: new Date(),
        endDate: new Date(),
        userId: 1,
        closed: false,
      };

      const mock = jest.spyOn(rentalsRepository, 'getRentalById').mockImplementationOnce((): any => {
        return rentalMock;
      });

      const result = await rentalsService.getRentalById(123);
      expect(mock).toBeCalledTimes(1)
      expect(result).toEqual(rentalMock);
    })
  })

  describe('getUserForRental' , () => {
    it('should throw user not found error when user doesnt exist', () => {
      const mock = jest.spyOn(usersRepository, 'getById').mockImplementationOnce((): any => {
        return undefined;
      });

      const result = rentalsService.getUserForRental(123);
      expect(mock).toBeCalledTimes(1);
      expect(result).rejects.toEqual({
        name: "NotFoundError",
        message: 'User not found.'
      });
    })

    it('should return user data', async () => {
      const user: User = {
        id: 1,
        firstName: 'Josefino',
        lastName: 'Silva',
        email: 'josefino@teste.com',
        cpf: '9999999999',
        birthDate: new Date(),
      };

      const mock = jest.spyOn(usersRepository, 'getById').mockImplementationOnce((): any => {
        return user;
      });

      const result = await rentalsService.getUserForRental(1);

      expect(mock).toBeCalledTimes(1);
      expect(result).toEqual(user);
    })
  })

  describe('checkUserAbleTorent', () => {
    it('should throw pendent rental error when user has rental that isnt closed', async () => {
      const rentals = [
        {
          id: 123,
          date: new Date(),
          endDate: new Date(),
          userId: 1,
          closed: false,
        }
      ];

      const mock = jest.spyOn(rentalsRepository, 'getRentalsByUserId').mockImplementationOnce((): any => {
        return rentals;
      });

      const result = rentalsService.checkUserAbleToRental(1);

      expect(mock).toBeCalledTimes(1);
      expect(result).rejects.toEqual({
        name: "PendentRentalError",
        message: 'The user already have a rental!',
      });
    })
  })

  describe('userIsUnderAge', () => {
    it('should return true when user age is 17', () => {
      const user = {
        id: 1,
        firstName: 'Josefino',
        lastName: 'Silva',
        email: 'josefino@teste.com',
        cpf: '9999999999',
        birthDate: new Date('2006-11-04'),
      };

      const result = rentalsService.userIsUnderAge(user);

      expect(result).toBe(true);
    })


    it('should return false when user age is 23', () => {
      const user: User = {
        id: 1,
        firstName: 'Josefino',
        lastName: 'Silva',
        email: 'josefino@teste.com',
        cpf: '9999999999',
        birthDate: new Date('2000-11-04'),
      };

      const result = rentalsService.userIsUnderAge(user);

      expect(result).toBe(false);
    })
  })

  describe('createRental', () => {
    it('should ')
  })
})