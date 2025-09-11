// Music-related shared interfaces and types

export type SearchResultType = "tracks" | "albums" | "artists" | "playlists";

export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  cover: string;
  previewUrl?: string;
  artistId?: string;
}

export interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  cover: string;
  kind: SearchResultType;
  artistId?: string;
}

export type MainTab = "tracks" | "albums" | "artists";

export interface PlayerProps {
  embedUrl: string;
  embedHeight: number;
  onPrev?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  onShuffle?: () => void;
  onRepeat?: () => void;
  repeatActive?: boolean;
  likedActive?: boolean;
  isSearchMode?: boolean;
  onExpand?: () => void;
}

export interface MusicWidgetProps {
  title?: string;
  tracks?: TrackItem[];
  spotifyTrackUrl?: string;
}

export interface SearchResultsProps {
  items: SearchItem[];
  label: string;
  onChoose: (item: SearchItem) => void;
}

export interface SearchTabsProps {
  activeTab: MainTab;
  onChange: (tab: MainTab) => void;
}
