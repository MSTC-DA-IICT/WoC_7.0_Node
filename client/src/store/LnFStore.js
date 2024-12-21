import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./authStore.js";

export const useLnFStore = create((set, get) => ({
  places: [],
  lostMessages: [],
  foundMessages: [],
  isLoading: false,

  // Fetch the list of places
  getPlaces: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/places");
      set({ places: res.data });
    } catch (error) {
      toast.error("Failed to fetch places.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Add a new place
  addPlace: async (placeData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/places/add", placeData);
      set((state) => ({ places: [...state.places, res.data] }));
      toast.success("Place added successfully.");
    } catch (error) {
      toast.error("Failed to add place.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Remove a place
  removePlace: async (placeId) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/places/${placeId}/remove`);
      set((state) => ({
        places: state.places.filter((place) => place._id !== placeId),
      }));
      toast.success("Place removed successfully.");
    } catch (error) {
      toast.error("Failed to remove place.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch lost messages for a specific place
  getLostMessages: async (placeId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/places/${placeId}/messages/lost`);
      set({ lostMessages: res.data });
    } catch (error) {
      toast.error("Failed to fetch lost messages.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch found messages for a specific place
  getFoundMessages: async (placeId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/places/${placeId}/messages/found`);
      set({ foundMessages: res.data });
    } catch (error) {
      toast.error("Failed to fetch found messages.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Send a lost message
  sendLostMessage: async (placeId, messageData) => {
    try {
      const res = await axiosInstance.post(
        `/places/${placeId}/messages/lost`,
        messageData
      );
      set((state) => ({
        lostMessages: [...state.lostMessages, res.data],
      }));
      toast.success("Lost message sent successfully.");
    } catch (error) {
      toast.error("Failed to send lost message.");
    }
  },

  // Send a found message
  sendFoundMessage: async (placeId, messageData) => {
    try {
      const res = await axiosInstance.post(
        `/places/${placeId}/messages/found`,
        messageData
      );
      set((state) => ({
        foundMessages: [...state.foundMessages, res.data],
      }));
      toast.success("Found message sent successfully.");
    } catch (error) {
      toast.error("Failed to send found message.");
    }
  },

  // Delete a lost message
  deleteLostMessage: async (placeId, messageId) => {
    try {
      await axiosInstance.delete(`/places/${placeId}/messages/lost/${messageId}`);
      set((state) => ({
        lostMessages: state.lostMessages.filter((msg) => msg._id !== messageId),
      }));
      toast.success("Lost message deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete lost message.");
    }
  },

  // Delete a found message
  deleteFoundMessage: async (placeId, messageId) => {
    try {
      await axiosInstance.delete(`/places/${placeId}/messages/found/${messageId}`);
      set((state) => ({
        foundMessages: state.foundMessages.filter((msg) => msg._id !== messageId),
      }));
      toast.success("Found message deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete found message.");
    }
  },

  // Connect socket for real-time updates
  connectSocket: () => {
    const { socket } = useAuthStore.getState(); // Access shared socket instance from Auth store
    if (!socket) return;

    // Listen for real-time updates for LnF
    socket.on("newLostMessage", (data) => {
      set((state) => ({
        lostMessages: [...state.lostMessages, data],
      }));
    });

    socket.on("newFoundMessage", (data) => {
      set((state) => ({
        foundMessages: [...state.foundMessages, data],
      }));
    });
  },
}));
