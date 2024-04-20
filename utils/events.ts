import type { User } from "lucia";
import { db } from "./db";
import { Event as TSEvent, Team } from "@prisma/client";

export const getCurrentEvent = async (user: User | null) => {
	const currentEvent = await db.event.findFirst({
		where: {
			status: "REGISTRATION",
		},
		select: {
			id: true,
			title: true,
			date: true,
			image: true,
			imageWhite: true,
			location: true,
			description: true,
			details: true,
			status: true,
			_count: {
				select: {
					teams: true,
				},
			},
		},
	});

	if (currentEvent && user) {
		const registeredTeam = await db.team.findFirst({
			select: {
				id: true,
				eventId: true,
				members: {
					select: {
						userId: true,
						role: true,
					},
				},
				repo: true,
			},
			where: {
				eventId: currentEvent.id,
				members: {
					some: {
						userId: user.id,
					},
				},
			},
		});

		return {
			event: currentEvent,
			team: registeredTeam,
		};
	}
	return {
		event: currentEvent,
		team: null,
	};
};

export const getEvents = async () => {
	const events = await db.event.findMany({
		where: {
			status: "RESULTS",
		},
		select: {
			id: true,
			title: true,
			date: true,
			image: true,
			status: true,
			description: true,
			details: true,
			_count: {
				select: {
					teams: true,
				},
			},
		},
	});

	return events;
};
