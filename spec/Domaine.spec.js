import prisma from "../src/config/prisma.js";
import DomainCtrl from "../src/Controllers/DomainCtrl.js";


describe("DomainCtrl", () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            json: jasmine.createSpy("json"),
            status: jasmine.createSpy("status").and.returnValue({ json: jasmine.createSpy("json") }),
        };
        next = jasmine.createSpy("next");
    });

    afterEach(() => {
       
    });

    describe("getDomainById", () => {
        it("should return a domain if found", async () => {
            const mockDomain = { id: 1, name: "Technology" };
            req.params = { id: "1" };
            spyOn(prisma.domain, "findUnique").and.returnValue(Promise.resolve(mockDomain));

            await DomainCtrl.getDomainById(req, res, next);

            expect(prisma.domain.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(res.json).toHaveBeenCalledWith(mockDomain);
            expect(res.status).not.toHaveBeenCalledWith(404);
        });

        it("should return 404 if domain not found", async () => {
            req.params = { id: "999" };
            spyOn(prisma.domain, "findUnique").and.returnValue(Promise.resolve(null));

            await DomainCtrl.getDomainById(req, res, next);

            expect(prisma.domain.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.status().json).toHaveBeenCalledWith({ message: "Domain not found" });
        });

        it("should return 500 if there is a server error", async () => {
            req.params = { id: "1" };
            spyOn(prisma.domain, "findUnique").and.throwError("Server error");

            await DomainCtrl.getDomainById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status().json).toHaveBeenCalledWith({ error: "Server error" });
        });
    });

    describe("getAllDomains", () => {
        it("should return all domains", async () => {
            const mockDomains = [
                { id: 1, name: "Technology" },
                { id: 2, name: "Healthcare" },
            ];
            spyOn(prisma.domain, "findMany").and.returnValue(Promise.resolve(mockDomains));

            await DomainCtrl.getAllDomains(req, res, next);

            expect(prisma.domain.findMany).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockDomains);
        });

        it("should return 500 if there is a server error", async () => {
            spyOn(prisma.domain, "findMany").and.throwError("Server error");

            await DomainCtrl.getAllDomains(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status().json).toHaveBeenCalledWith({ error: "Server error" });
        });
    });

    describe("createDomain", () => {
        it("should create a new domain", async () => {
            const mockDomain = { id: 1, name: "Technology" };
            req.body = { name: "Technology" };
            spyOn(prisma.domain, "create").and.returnValue(Promise.resolve(mockDomain));

            await DomainCtrl.createDomain(req, res, next);

            expect(prisma.domain.create).toHaveBeenCalledWith({ data: { name: "Technology" } });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.status().json).toHaveBeenCalledWith(mockDomain);
        });

        it("should return 500 if there is a server error", async () => {
            req.body = { name: "Technology" };
            spyOn(prisma.domain, "create").and.throwError("Server error");

            await DomainCtrl.createDomain(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status().json).toHaveBeenCalledWith({ error: "Server error" });
        });
    });

    describe("updateDomain", () => {
        it("should update a domain if found", async () => {
            const mockDomain = { id: 1, name: "Technology" };
            req.params = { id: "1" };
            req.body = { name: "Updated Technology" };
            spyOn(prisma.domain, "update").and.returnValue(Promise.resolve(mockDomain));

            await DomainCtrl.updateDomain(req, res, next);

            expect(prisma.domain.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { name: "Updated Technology" },
            });
            expect(res.json).toHaveBeenCalledWith(mockDomain);
        });

        it("should return 404 if domain not found", async () => {
            req.params = { id: "999" };
            req.body = { name: "Updated Technology" };
            spyOn(prisma.domain, "update").and.throwError({ code: "P2025" });

            await DomainCtrl.updateDomain(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.status().json).toHaveBeenCalledWith({ error: "Domain not found" });
        });

        it("should return 500 if there is a server error", async () => {
            req.params = { id: "1" };
            req.body = { name: "Updated Technology" };
            spyOn(prisma.domain, "update").and.throwError("Server error");

            await DomainCtrl.updateDomain(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status().json).toHaveBeenCalledWith({ error: "Server error" });
        });
    });

    describe("deleteDomain", () => {
        it("should delete a domain if found", async () => {
            const mockDomain = { id: 1, name: "Technology" };
            req.params = { id: "1" };
            spyOn(prisma.domain, "delete").and.returnValue(Promise.resolve(mockDomain));

            await DomainCtrl.deleteDomain(req, res, next);

            expect(prisma.domain.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(res.json).toHaveBeenCalledWith({
                message: "Domain deleted successfully",
                deletedDomain: mockDomain,
            });
        });

        it("should return 404 if domain not found", async () => {
            req.params = { id: "999" };
            spyOn(prisma.domain, "delete").and.throwError({ code: "P2025" });

            await DomainCtrl.deleteDomain(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.status().json).toHaveBeenCalledWith({ error: "Domain not found" });
        });

        it("should return 500 if there is a server error", async () => {
            req.params = { id: "1" };
            spyOn(prisma.domain, "delete").and.throwError("Server error");

            await DomainCtrl.deleteDomain(req, res, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status().json).toHaveBeenCalledWith({ error: "Server error" });
        });
    });
});
