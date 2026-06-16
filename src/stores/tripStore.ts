import { defineStore } from 'pinia';
import { DEFAULT_COVER_GALLERY, TripStatus } from '../constants/trip';
import type { Trip } from '../models/trip';
import { tripApi } from '../api/tripApi';
import { messages } from '../constants/messages';
import { toast } from '../utils/message';
import { generatePlaceholderCover } from '../utils/formatters';

export const useTripStore = defineStore('trip', {
  state: () => ({ trips: tripApi.list() as Trip[], statusFilter: 'all' as TripStatus | 'all' }),
  getters: {
    filteredTrips: (state) => state.statusFilter === 'all' ? state.trips : state.trips.filter((trip) => trip.status === state.statusFilter),
  },
  actions: {
    createTrip(title = '杭州周末慢旅行', destination = '杭州', coverImage = '') {
      const finalCover = coverImage || DEFAULT_COVER_GALLERY[Math.floor(Math.random() * DEFAULT_COVER_GALLERY.length)];
      const trip: Trip = {
        id: crypto.randomUUID(),
        title,
        destination,
        cover_image: finalCover,
        start_date: new Date().toISOString().slice(0, 10),
        end_date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
        budget: 3200,
        currency: 'CNY',
        members: ['我', '朋友'],
        status: TripStatus.PLANNING,
        created_at: new Date().toISOString(),
      };
      this.trips.unshift(trip);
      tripApi.save(this.trips);
      toast.ok(messages.tripCreated);
      return trip.id;
    },
    removeTrip(id: string) {
      this.trips = this.trips.filter((trip) => trip.id !== id);
      tripApi.save(this.trips);
      toast.ok(messages.tripDeleted);
    },
    updateTripCover(id: string, coverImage: string) {
      const trip = this.trips.find((t) => t.id === id);
      if (trip) {
        trip.cover_image = coverImage || generatePlaceholderCover(trip.destination);
        tripApi.save(this.trips);
        toast.ok('封面已更新');
      }
    },
    updateTrip(id: string, data: Partial<Trip>) {
      const trip = this.trips.find((t) => t.id === id);
      if (trip) {
        Object.assign(trip, data);
        tripApi.save(this.trips);
        toast.ok('旅行信息已更新');
      }
    },
  },
});

