import { test, expect, Page } from "@playwright/test";
import MailosaurClient from "mailosaur";
const mailosaur = new MailosaurClient("HsnixEWVxvxSbhQRDBf8OkGrwKCjioe6");
const serverId = "5ftroqqw";
import { agentEmail, companyEmail } from '../utils/email';
// test.beforeAll(async () => {
// });
test.describe.configure({ mode: 'serial' });
test.describe("agent", () => {
  test.describe.configure({ mode: "serial" });
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/login");
  });
  // ทดสอบการลงทะเบียนผู้ใช้งาน
  test("สมัคร user agent", async ({ page }) => {
    // ไปยังหน้าเว็บล็อกอิน
    await page.goto("http://localhost:3000/login");

    // คลิกที่ลิ้งค์ "Register"
    await page.getByRole("link", { name: "Register" }).click();

    // กรอกอีเมลล์ในช่อง "Email address"
    await page.getByPlaceholder("Email address").fill(agentEmail);
    // คลิกที่ปุ่ม "Next"
    await page.getByRole("button", { name: "Next" }).click();
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // ดึงข้อความอีเมลล์จาก Mailosaur และเก็บไวย์ในตัวแปร email
    const email = await mailosaur.messages.get(serverId, {
      sentTo: agentEmail,
    });

    let verificationCode: any;

    // ตรวจสอบว่ามีโค้ดในอีเมลล์หรือไม่
    expect(email.html?.codes).toBeDefined();

    if (email.html?.codes != null && email.html?.codes != undefined) {
      // กำหนด verificationCode จากค่าโค้ดในอีเมลล์
      verificationCode = email.html?.codes[0].value;
    }

    // กรอก verification code ตามลำดับ
    await page.locator(".bg-transparent").first().fill(verificationCode[0]);
    await page
      .locator("div:nth-child(2) > .bg-transparent")
      .fill(verificationCode[1]);
    await page
      .locator("div:nth-child(3) > .bg-transparent")
      .fill(verificationCode[2]);
    await page
      .locator("div:nth-child(4) > .bg-transparent")
      .fill(verificationCode[3]);
    await page
      .locator("div:nth-child(5) > .bg-transparent")
      .fill(verificationCode[4]);
    await page
      .locator("div:nth-child(6) > .bg-transparent")
      .fill(verificationCode[5]);
    await page.getByRole("button", { name: "Next" }).click();
    await expect(
      page
        .locator("div")
        .filter({ hasText: "INFORMATIONAgent3/4สัญชาติ" })
        .nth(3)
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Next" })).toBeVisible();
    await page
      .locator("div")
      .filter({ hasText: /^สัญชาติThaiIndonesian$/ })
      .getByRole("combobox")
      .click();
    await page.getByLabel("Thai").getByText("Thai").click();
    await page
      .locator("div")
      .filter({ hasText: /^คำนำหน้าMr\.Mrs\.$/ })
      .getByRole("combobox")
      .click();
    await page.getByLabel("Mr.").click();
    await page.locator('input[name="firstName"]').fill("testbefore");
    await page.locator('input[name="lastName"]').fill("testbeforelast");
    await page.getByRole("button", { name: "Next" }).click();
    await expect(
      page.getByPlaceholder("Password", { exact: true })
    ).toBeVisible();
    await expect(page.getByPlaceholder("Re-password")).toBeVisible();
    await page.getByPlaceholder("Password", { exact: true }).fill("12345678");
    await page.getByPlaceholder("Re-password").fill("12345678");
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "ข้ามไปก่อน" }).click();
  });
  test("edit agent profile", async ({ page }) => {
    // ใส่ email ของ agent
    await page.getByPlaceholder("email or usermane").fill(agentEmail);
    // ใส่ password
    await page.getByPlaceholder("Password").fill("12345678");
    // คลิก เข้าสู่ระบบ
    await page.getByRole("button", { name: "Login" }).click();
    // ตรวจสอบปุ่มแสดงผลลัพธ์
    await expect(page.getByRole("button")).toBeVisible();
    // ให้เวลาให้เข้าสู่ระบบครบ 2 วินาที
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // คลิกปุ่มแสดงผลลัพธ์
    await page.getByRole("button").click();
    // คลิกปุ่มโปรไฟล์
    await page.getByRole('link', { name: 'Agent Management' }).click();
    // รอเพจเปลี่ยนไปยัง http://localhost:3000/profile/information
    await page.waitForURL("http://localhost:3000/profile/information");
    // ตรวจสอบว่ามี container ข้อมูลข้อมูลผู้ใช้
    await expect(page.locator(".information-container")).toBeVisible();
    // รอเพจเปลี่ยนไปยัง http://localhost:3000/profile/information และเฉลี่ยสิ้นเปลี่ยนแปลง
    await page.waitForURL("http://localhost:3000/profile/information", {
      waitUntil: "commit",
    });
    // ถ่ายรูปหน้าต่างก่อนแก้ไข
    await page.screenshot({
      path: `./screenshot/before${new Date().getTime()}.png`,
      fullPage: true,
    });
    // ใส่ชื่อ
    await page.getByText("ชาย").click();
    // ใส่ชื่อจริง
    await page.locator('input[name="first_name"]').fill("testtest2");
    // ใส่นามสกุล
    await page.locator('input[name="last_name"]').fill("test2");
    // ใส่เลขประชาชน
    await page.locator('input[name="id_card"]').fill("1234567890123");
    // ใส่วันที่เกิด
    await page.locator('input[name="dob"]').fill("2024-05-08");
    // ถ่ายรูปหน้าต่างหลังจากแก้ไข
    await page.screenshot({
      path: `./screenshot/after${new Date().getTime()}.png`,
    });
    // คลิก บันทึกการอัพเดท
    await page.getByRole("button", { name: "บันทึกการอัพเดท" }).click();
    // ตรวจสอบว่าส่งข้อความสำเร็จ
    // await expect(page.getByText("Success")).toBeVisible();
    await expect(
      page.locator("li").filter({ hasText: /^Success$/ })
    ).toBeVisible();
  });
});
test.describe("company", () => {
  test.describe.configure({ mode: "serial" });
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/login");
  });
  test("register company", async ({ page, request }) => {
    const loginDeveloper = await request.post(
      `http://localhost:5000/interface-developer/login`,
      {
        data: {
          developer_code: "icontime1",
          user_id: "aaaaaaaa",
          email: "test@iconframework.com",
          first_name: "นายเอ",
          last_name: "เกือบบี",
          mobile: "0810000000",
        },
      }
    );
    const setCookieHeader = loginDeveloper.headers()["set-cookie"];

    let accessToken: string | null = null;
    let sendemailres: any;
    if (setCookieHeader) {
      const cookies = setCookieHeader.split(",");

      // Find the cookie with the name 'access_token'
      const accessTokenCookie = cookies.find((cookieString) =>
        cookieString.trim().startsWith("access_token=")
      );

      // Extract the value of the 'access_token' cookie
      accessToken = accessTokenCookie
        ? accessTokenCookie.trim().split("=")[1]
        : null;
    }
    if (accessToken != null) {
      await request.post(
        `http://localhost:5000/interface-developer/invite-agency`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            email: companyEmail,
          },
        }
      );
    }

    // ดึงข้อความอีเมลล์จาก Mailosaur และเก็บไว้ในตัวแปร email
    const email = await mailosaur.messages.get(serverId, {
      sentTo: companyEmail,
    });

    let verificationLink: string;

    // ตรวจสอบว่ามีโค้ดในอีเมลล์หรือไม่
    expect(email.html).toBeDefined();

    if (email.html?.links != null && email.html?.links != undefined) {
      // กำหนด verificationCode จากค่าโค้ดในอีเมลล์
      verificationLink = email.html.links[0].href as string;
      await page.goto(verificationLink);
    }
    await expect(page.getByRole("button", { name: "Next" })).toBeVisible();
    await page.getByPlaceholder("Company name").fill("companyuitest");
    await page.getByPlaceholder("Phone number").fill("0123456789");
    await page.getByRole("button", { name: "Next" }).click();
    await expect(
      page.getByPlaceholder("Password", { exact: true })
    ).toBeVisible();
    await expect(page.getByPlaceholder("Re-password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Next" })).toBeVisible();
    await page.getByPlaceholder("Password", { exact: true }).fill("12345678");
    await page.getByPlaceholder("Re-password").fill("12345678");
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Start" }).click();
  });
  test("edit company profile", async ({ page }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await page.getByPlaceholder("email or usermane").fill(companyEmail);
    await page.getByPlaceholder("Password").fill("12345678");
    await expect(page.getByRole("button")).toBeVisible();
    await page.getByRole("button", { name: "Login" }).click();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.getByRole("button").click();
    await expect(page.getByRole("link", { name: 'Agent Management' })).toBeVisible();
    await page.getByRole("link", { name: 'Agent Management' }).click();
    await page.waitForURL("http://localhost:3000/profile/information");
    await expect(page.locator(".information-container")).toBeVisible();
    await page.waitForURL("http://localhost:3000/profile/information", {
      waitUntil: "commit",
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
    await page.screenshot({
      path: `./screenshot/before${new Date().getTime()}.png`,
      fullPage: true,
    });
    await page.locator('input[name="code"]').fill("a123");
    await page.locator('input[name="tax_id"]').fill("1234567890123");
    await page.getByRole("button", { name: "บันทึกการอัพเดท" }).click();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await page.screenshot({
      path: `./screenshot/after${new Date().getTime()}.png`,
    });
    await expect(
      page.locator("li").filter({ hasText: /^Success$/ })
    ).toBeVisible();
  });
  test("company invite agent", async ({ page }) => {
    await expect(page.getByPlaceholder("email or usermane")).toBeVisible();
    await page.getByPlaceholder("email or usermane").fill(companyEmail);
    await expect(page.getByPlaceholder("Password")).toBeVisible();
    await page.getByPlaceholder("Password").fill("12345678");
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
    await page.getByRole("button", { name: "Login" }).click();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await expect(page.getByRole("button")).toBeVisible();
    await page.getByRole("button").click();
    await expect(page.getByRole("link", { name: 'Agent Management' })).toBeVisible();
    await page.getByRole("link", { name: 'Agent Management' }).click();
    await page.waitForURL("http://localhost:3000/profile/information");
    await expect(page.locator(".information-container")).toBeVisible();
    await page.waitForURL("http://localhost:3000/profile/information", {
      waitUntil: "commit",
    });
    await expect(page.getByRole("link", { name: "My Agents" })).toBeVisible();
    await page.getByRole("link", { name: "My Agents" }).click();
    await expect(page.getByRole("link", { name: "Agent List" })).toBeVisible();
    await page.getByRole("link", { name: "Agent List" }).click();
    await expect(page.getByRole("button", { name: "Create" })).toBeVisible();
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await page.locator('input[name="email"]').fill(agentEmail);
    await expect(
      page
        .locator("div")
        .filter({ hasText: /^Create$/ })
        .nth(3)
    ).toBeVisible();
    await page
      .locator("div")
      .filter({ hasText: /^Create$/ })
      .nth(3)
      .click();
    await expect(page.getByText("ข้อมูลเอเจ้นท์สถานะ :")).toBeVisible();
  });
  test("agent receive email invite", async ({ page }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const email = await mailosaur.messages.get(serverId, {
      sentTo: agentEmail,
    });
    let verificationLink: string;

    // ตรวจสอบว่ามีโค้ดในอีเมลล์หรือไม่
    expect(email.html).toBeDefined();

    if (email.html?.links != null && email.html?.links != undefined) {
      // กำหนด verificationCode จากค่าโค้ดในอีเมลล์
      verificationLink = email.html.links[0].href as string;
      await page.goto(verificationLink);
    }
    const currentPageUrl = page.url();
    if (currentPageUrl.includes("is_verified_email=false")) {
      //ยังไม่เคยมี users ในระบบ
      await expect(
        page
          .locator("div")
          .filter({ hasText: "INFORMATIONAgent3/4สัญชาติ" })
          .nth(3)
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "Next" })).toBeVisible();
      await page
        .locator("div")
        .filter({ hasText: /^สัญชาติThaiIndonesian$/ })
        .getByRole("combobox")
        .click();
      await page.getByLabel("Thai").getByText("Thai").click();
      await page
        .locator("div")
        .filter({ hasText: /^คำนำหน้าMr\.Mrs\.$/ })
        .getByRole("combobox")
        .click();
      await page.getByLabel("Mr.").click();
      await page.locator('input[name="firstName"]').fill("testbefore");
      await page.locator('input[name="lastName"]').fill("testbeforelast");
      await page.getByRole("button", { name: "Next" }).click();
      await expect(
        page.getByPlaceholder("Password", { exact: true })
      ).toBeVisible();
      await expect(page.getByPlaceholder("Re-password")).toBeVisible();
      await page.getByPlaceholder("Password", { exact: true }).fill("12345678");
      await page.getByPlaceholder("Re-password").fill("12345678");
      await page.getByRole("button", { name: "Next" }).click();
      await page.getByRole("button", { name: "Start" }).click();
    } else {
      await expect(page.getByPlaceholder("email or usermane")).toBeVisible();
      await page.getByPlaceholder("email or usermane").fill(agentEmail);
      await expect(page.getByPlaceholder("Password")).toBeVisible();
      await page.getByPlaceholder("Password").fill("12345678");
      await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
      await page.getByRole("button", { name: "Login" }).click();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await page.getByRole("button", { name: "Start" }).click();
    }
  });
  test("company accept agent", async ({ page }) => {
    await expect(page.getByPlaceholder("email or usermane")).toBeVisible();
    await page.getByPlaceholder("email or usermane").fill(companyEmail);
    await expect(page.getByPlaceholder("Password")).toBeVisible();
    await page.getByPlaceholder("Password").fill("12345678");
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
    await page.getByRole("button", { name: "Login" }).click();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await expect(page.getByRole("button")).toBeVisible();
    await page.getByRole("button").click();
    await expect(page.getByRole("link", { name: 'Agent Management' })).toBeVisible();
    await page.getByRole("link", { name: 'Agent Management' }).click();
    await page.waitForURL("http://localhost:3000/profile/information");
    await expect(page.locator(".information-container")).toBeVisible();
    await page.waitForURL("http://localhost:3000/profile/information", {
      waitUntil: "commit",
    });
    await expect(page.getByRole("link", { name: "My Agents" })).toBeVisible();
    await page.getByRole("link", { name: "My Agents" }).click();
    await expect(page.getByRole("link", { name: "Agent List" })).toBeVisible();
    await page.getByRole("link", { name: "Agent List" }).click();
    await expect(page.locator('td:nth-child(11)')).toBeVisible();
    await page.locator('td:nth-child(11)').click();
    await expect(page.getByRole('button', { name: 'อนุมัติ' })).toBeVisible();
    await page.getByRole('button', { name: 'อนุมัติ' }).click();
  });
});
