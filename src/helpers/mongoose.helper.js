export default {
  errorResponse: (error) => {
    switch (error.code) {
      case 11000:
        return {
          status: 409,
          success: false,
          message: `An event with the provided code already exists`,
        }
      default:
        return {
          status: 500,
          message: 'Internal Server Error',
        }
    }
  },
}
