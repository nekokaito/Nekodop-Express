import app from "./app";

async function main() {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`server on http://localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}
main();
