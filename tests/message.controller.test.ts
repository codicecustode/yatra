import request from "supertest";
import app from "../src/app";
import * as messageService from "../src/services/message.service";
import * as socketHandler from "../src/sockets/socket.handler";

jest.mock("../src/middleware/auth.middleware", () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { id: "user1" }; // fake logged-in user
    next();
  },
}));

jest.mock("../src/services/message.service");
jest.mock("../src/sockets/socket.handler");

describe("Message Controller Create Message", () => {
  it("should create a message successfully", async () => {
    const fakeMessage = {
      _id: "msg1",
      content: "Hello",
      sender: "user1",
      receiver: "user2",
    };

    (messageService.createMessageService as jest.Mock).mockResolvedValue(
      fakeMessage
    );

    const res = await request(app).post("/api/messages").send({
      receiverId: "user2",
      content: "Hello",
    });

    expect(res.status).toBe(201);
    expect(res.body.content).toBe("Hello");
    expect(socketHandler.emitNewMessage).toHaveBeenCalled();
  });
});
