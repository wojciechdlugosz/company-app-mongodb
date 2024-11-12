const Department = require("../department.model");
const expect = require("chai").expect;
const mongoose = require("mongoose");

describe("Department", () => {
  before(async () => {
    //before, ponieważ chcemy, aby testy uruchomiły się dopiero wtedy, kiedy mamy pewność, że połączenie jest gotowe
    try {
      await mongoose.connect("mongodb://localhost:27017/companyDBtest", {
        //jeśli próbujemy połączyć się z bazą, która nie istnieje, to Mongoose po prostu ją utworzy - companyDBtest
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.error(err);
    }
  });

  describe("Reading data", () => {
    before(async () => {
      const testDepOne = new Department({ name: "Department #1" });
      await testDepOne.save();

      const testDepTwo = new Department({ name: "Department #2" });
      await testDepTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const departments = await Department.find();
      const expectedLength = 2;
      expect(departments.length).to.be.equal(expectedLength);
    });

    it('should return a proper document by "name" with "findOne" method', async () => {
      const department = await Department.findOne({ name: "Department #1" });
      const expectedName = "Department #1";
      expect(department.name).to.be.equal(expectedName);
    });

    after(async () => {
      await Department.deleteMany();
    });
  });

  describe("Creating data", () => {
    it('should insert new document with "insertOne" method', async () => {
      const department = new Department({ name: "Department #1" });
      await department.save();
      expect(department.isNew).to.be.false;
    });

    after(async () => {
      await Department.deleteMany();
    });
  });

  describe("Updating data", () => {
    beforeEach(async () => {
      const testDepOne = new Department({ name: "Department #1" });
      await testDepOne.save();

      const testDepTwo = new Department({ name: "Department #2" });
      await testDepTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Department.updateOne(
        { name: "Department #1" },
        { $set: { name: "=Department #1=" } }
      );
      const updatedDepartment = await Department.findOne({
        name: "=Department #1=",
      });
      expect(updatedDepartment).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const department = await Department.findOne({ name: "Department #1" });
      department.name = "=Department #1=";
      await department.save();

      const updatedDepartment = await Department.findOne({
        name: "=Department #1=",
      });
      expect(updatedDepartment).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Department.updateMany({}, { $set: { name: "new" } });
      const departments = await Department.find();
      expect(departments[0].name).to.be.equal("new");
      expect(departments[1].name).to.be.equal("new");
    });

    afterEach(async () => {
      await Department.deleteMany();
    });
  });

  describe("Removing data", () => {
    beforeEach(async () => {
      const testDepOne = new Department({ name: "Department #1" });
      await testDepOne.save();

      const testDepTwo = new Department({ name: "Department #2" });
      await testDepTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Department.deleteOne({ name: "Department #1" });
      const deletedDepartment = await Department.findOne({
        name: "Department #1",
      });
      expect(deletedDepartment).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Department.deleteMany();
      const deletedDepartments = await Department.find();
      expect(deletedDepartments.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Department.deleteMany();
    });
  });
});