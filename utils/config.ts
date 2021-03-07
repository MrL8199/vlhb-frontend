export default {
  siteName: 'VLHB Admin',
  copyright: 'VLHB Admin  ©2020 vlCoder',
  logoPath: '/public/images/logo1.png',
  fixedHeader: true, // sticky primary layout header
  /* Layout configuration, specify which layout to use for route. */
  layouts: [
    {
      name: 'primary',
      include: [/.*/],
      exclude: [/(\/(en|zh))*\/login/],
    },
  ],
};
