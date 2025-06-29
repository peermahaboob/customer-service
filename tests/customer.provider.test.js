const { Verifier } = require("@pact-foundation/pact");
const customerApp = require("../index");

describe("Customer Service Provider Tests", () => {
  let server;

  beforeAll((done) => {
    server = customerApp.listen(8081, () => {
      console.log("Customer Service running on port 8081 for provider tests");
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it("should validate the expectations of OrderService", async () => {
    const opts = {
      provider: "CustomerService",
      providerBaseUrl: "http://localhost:8081",
      pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
      pactBrokerToken: process.env.PACT_BROKER_TOKEN,
      publishVerificationResult: true,
      providerVersion: process.env.GIT_COMMIT || "1.0.0",
      consumerVersionSelectors: [
        { mainBranch: true }, // Get pacts from main branch
        { latest: true }, // Get latest pacts regardless of tag
      ],
      stateHandlers: {
        "customer with id 1 exists": () => Promise.resolve(),
        "customer with id 999 does not exist": () => Promise.resolve(),
      },
    };

    await new Verifier(opts).verifyProvider();
  });
});