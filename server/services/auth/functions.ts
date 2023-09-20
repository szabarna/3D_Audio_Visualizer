import bcrypt from 'bcrypt';

async function checkPassword(inputPassword: string, storedHash: string) {
  const match = await bcrypt.compare(inputPassword, storedHash);
  if (match) {
    console.log("Passwords match!");
  } else {
    console.log("Invalid password.");
  }
}

