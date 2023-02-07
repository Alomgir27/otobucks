import { get } from "../services/RestService";

const config = {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
};

export const getUpcomingBookings = async () => {
  const res = await get(`/bookings`, config);
  return res;
};

export const getDashboardStats = async () => {
  const res = await get(`/auth/providers/dashboard/statistics`, config);
  return res;
};

export const getTransactionStatistics = async (
  graph,
  startDate,
  endDate,
  setLoadingGraph
) => {
  try {
    setLoadingGraph &&
      setLoadingGraph((prev) => {
        return {
          ...prev,
          [graph]: true,
        };
      });
    const endPoint =
      graph === "earning"
        ? `transactionStats/${endDate}/${startDate}?type=spent`
        : `servicePerformance/${endDate}/${startDate}`;
    const res = await get(`/auth/providers/dashboard/${endPoint}`, config);
    setLoadingGraph &&
      setLoadingGraph((prev) => {
        return {
          ...prev,
          [graph]: false,
        };
      });
    return res;
  } catch (error) {
    setLoadingGraph &&
      setLoadingGraph((prev) => {
        return {
          ...prev,
          [graph]: false,
        };
      });
  }
};

export const getTotalOfEarning = async () => {
  const res = await get(`/auth/providers/dashboard/totalEarnings`, config);
  return res;
};
