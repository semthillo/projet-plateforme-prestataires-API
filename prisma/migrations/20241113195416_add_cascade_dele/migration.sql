-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserDomain" DROP CONSTRAINT "UserDomain_domain_id_fkey";

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDomain" ADD CONSTRAINT "UserDomain_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;
