def track_user_behavior(data):
    print(f"Tracking data: {data}")

def apply_user_preferences(data):
    font_sizes = [d["fontSize"] for d in data if "fontSize" in d]
    zoom_levels = [d["zoomLevel"] for d in data if "zoomLevel" in d]

    avg_font_size = sum(font_sizes) / len(font_sizes) if font_sizes else None
    avg_zoom_level = sum(zoom_levels) / len(zoom_levels) if zoom_levels else None

    preferences = {
        "averageFontSize": avg_font_size,
        "averageZoomLevel": avg_zoom_level,
    }
    print(f"Calculated preferences: {preferences}")
    return preferences
