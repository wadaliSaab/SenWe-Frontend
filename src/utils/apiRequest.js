export async function apiRequest(apiCall) {
  try {
    const response = await apiCall();

    return {
      success: true,
      data: response,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error,
    };
  }
}