class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}

export default ApiError;

// for error handling
// --------------------- 
// try {
//   await apiRequest(...);
// } catch (err) {
//   if (err instanceof ApiError) {
//     if (err.status === ...) {
//       navigate('...');
//     } else {
//       err.status;
//       err.message;
//     }
//   }
// }