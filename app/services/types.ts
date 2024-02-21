export interface MerkleResponse {
	result: {
		casts?: Cast[];
		users?: Profile[];
		verifications?: Verification[];
	};
	next?: {
		cursor: string;
	};
}

interface PFP {
	url: string;
	verified: boolean;
}

interface ProfileCore {
	fid: number;
	username: string;
	displayName: string;
	pfp?: PFP;
}

export interface Profile {
	fid: number;
	username?: string;
	displayName?: string;
	pfp?: PFP;
	profile?: {
		bio: {
			text: string;
			mentions: any[];
		};
	};
	followerCount?: number;
	followingCount?: number;
	referrerUsername?: string;
}

interface Embeds {
	images: {
		type: string;
		url: string;
		sourceUrl: string;
		alt: string;
	}[];
	urls: {
		type: string;
		openGraph: {
			url: string;
			sourceUrl: string;
			title: string;
			description: string;
			domain: string;
			image: string;
			useLargeImage: boolean;
		};
	}[];
	videos: any[];
	unknowns: any[];
	processedCastText: string;
}

interface Tag {
	type: string;
	id: string;
	name: string;
	imageUrl: string;
}
[];

export interface Cast {
	hash: string;
	_hashV1?: string;
	threadHash: string;
	_threadHashV1?: string;
	parentHash: string | null;
	_parentHashV1?: string | null;
	author: {
		fid: number;
		username: string;
		displayName: string;
		pfp?: PFP;
		profile?: {
			bio: {
				text: string;
				mentions: Array<string>;
			};
		};
		followerCount?: number;
		followingCount?: number;
		activeOnFcNetwork?: boolean;
	};
	text: string;
	timestamp: bigint;
	mentions?: ProfileCore[];
	replies: {
		count: number;
	};
	reactions: {
		count: number;
	};
	recasts: {
		count: number;
		recasters: Array<any>;
	};
	watches: {
		count: number;
	};
	parentAuthor?: Profile;
	embeds: Embeds | undefined;
	tags: Tag[] | undefined;
	quoteCount: number;
}

export interface Verification {
	fid: number;
	address: string;
	timestamp: number;
}

export interface FlattenedProfile {
	id: number;
	owner?: string | null;
	username?: string | null;
	display_name?: string | null;
	avatar_url?: string | null;
	avatar_verified?: boolean | null;
	followers?: number | null;
	following?: number | null;
	bio?: string | null;
	referrer?: string | null;
	registered_at?: Date;
	updated_at?: Date;
}
