const user = { username: "unittest-test-data" };
const userWithAddr = {
  ...user,
  address: "9901 N Hurst Ave, Portland, OR 97203, United States",
  lat: 45.594217,
  long: -122.708774,
};
const userWithTwoAddrs = {
  ...user,
  homes: [
    {
      address: "9901 N Hurst Ave, Portland, OR 97203, United States",
      lat: 45.594217,
      long: -122.708774,
    },
    {
      address: "2323 SE 34th Ave, Portland, OR 97214, USA",
      lat: 45.50595381913272,
      long: -122.62983670115167,
    },
  ],
};

export default {
  user,
  userWithAddr,
  userWithTwoAddrs,
};
