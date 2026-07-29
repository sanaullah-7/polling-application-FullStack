export const generateOtp = () =>
  String(Math.floor(100000 + Math.random() * 900000));

export const OtpExpiry = () => new Date(Date.now() + 10 * 60 * 1000);

export const otpValid = (user, otp) => {
  if (!user?.otp || !user?.otpExpires) return false;
  if (String(user.otp) !== String(otp)) return false;
  return new Date(user.otpExpires) > new Date();
};
