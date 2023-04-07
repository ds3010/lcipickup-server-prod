const functions = require("firebase-functions");

const cors = require("cors")({
  origin: "https://lcipickup.web.app",
});
// http request
exports.checkout = functions.https.onRequest((req, res) => {
  
  cors(req, res, async () => {
    //console.log("test")
    const stripe = require("stripe")(functions.config().stripe.secret_key);
    //console.log(req.body);
    const items = req.body.items;
    let lineItems = [];
    items.forEach((item) => {
      lineItems.push({ price: item.id, quantity: 1 });
    });

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: functions.config().stripe.success_url,
      cancel_url: functions.config().stripe.cancel_url,
    });

    //   return JSON.stringify({
    //     url: session.url,
    //   });
    res.send(
      JSON.stringify({
        url: session.url,
      })
    );
  });
});

//checkout.listen(4000, () => console.log("Listening on port 4000"));
