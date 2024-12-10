import requests
from datetime import datetime
from django.conf import settings
from movies.models import Movie, MovieActor
from actors.models import Actor

def fetch_tmdb_data():
    tmdb_url = "https://api.themoviedb.org/3/movie/popular"
    all_results = []
    
    for page in range(1, 402):  
        params = {
            'api_key': settings.TMDB_API_KEY,
            'language': 'ko-KR',  # 언어 설정 (필요시 변경)
            'page': page,
        }
        response = requests.get(tmdb_url, params=params)
        if response.status_code == 200:
            results = response.json().get('results', [])
            all_results.extend(results)  # 결과를 리스트에 추가
        else:
            print(f"Failed to fetch page {page}")
    
    return all_results


def fetch_tmdb_movie_details(movie_id):
    tmdb_url = f"https://api.themoviedb.org/3/movie/{movie_id}"
    params = {
        'api_key': settings.TMDB_API_KEY,
        'language': 'ko-KR',  # 언어 설정 (필요시 변경)
    }
    response = requests.get(tmdb_url, params=params)
    if response.status_code == 200:
        return response.json()
    return None

def fetch_tmdb_movie_credits(movie_id):
    tmdb_url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits"
    params = {
        'api_key': settings.TMDB_API_KEY,
        'language': 'ko-KR',
    }
    response = requests.get(tmdb_url, params=params)
    if response.status_code == 200:
        return response.json()
    return None

def fetch_tmdb_movie_stills(movie_id):
    tmdb_url = f"https://api.themoviedb.org/3/movie/{movie_id}/images"
    params = {
        'api_key': settings.TMDB_API_KEY,
    }
    response = requests.get(tmdb_url, params=params)
    if response.status_code == 200:
        backdrops = response.json().get('backdrops', [])
        return [backdrop['file_path'] for backdrop in backdrops]  # file_path만 반환
    return None

def fetch_tmdb_movie_trailers(movie_id):
    tmdb_url = f"https://api.themoviedb.org/3/movie/{movie_id}/videos"
    params = {
        'api_key': settings.TMDB_API_KEY,  
        'language': 'ko-KR'
    }
    response = requests.get(tmdb_url, params=params)
    if response.status_code == 200:
        data = response.json()
        clips = data.get('results', [])
        
        # 모든 YouTube 비디오 가져오기 (타입 필터링 없이)
        videos = [
            f"https://www.youtube.com/watch?v={clip['key']}" 
            for clip in clips 
            if clip['site'] == 'YouTube' and clip['type'] == 'Trailer'
        ]
        
        return videos
    else:
        print(f"Response: {response.text}")
    return None


def fetch_youtube_reviews(query, max_results=10):
    youtube_url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        'part': 'snippet',
        'q': query,
        'type': 'video',
        'videoCategoryId': '1',  # 카테고리 ID 1은 "Film & Animation"으로 영화 관련 영상에 적합
        'maxResults': max_results,
        'relevanceLanguage': 'ko',  # 한국어로 된 리뷰 영상만 검색
        'key': settings.YOUTUBE_API_KEY
    }
    response = requests.get(youtube_url, params=params)
    if response.status_code == 200:
        results = response.json().get('items', [])
        return [f"https://www.youtube.com/watch?v={item['id']['videoId']}" for item in results]
    return None

def save_tmdb_data():
    tmdb_data = fetch_tmdb_data()
    for movie in tmdb_data:
        existing_movie = Movie.objects.filter(title__iexact=movie['title']).exists()
        if not existing_movie:
            tmdb_details = fetch_tmdb_movie_details(movie['id'])
            if tmdb_details:
                title = tmdb_details.get('title', '')
                poster_url = f"https://image.tmdb.org/t/p/w500{tmdb_details['poster_path']}"
                description = tmdb_details.get('overview', '')
                if not description:
                    continue
                release_date = tmdb_details.get('release_date', None)
                if not release_date:
                    release_date = '1900-01-01'
                rating = tmdb_details.get('vote_average', 0.0)
                genres = tmdb_details.get('genres', [])
                origin_country = tmdb_details.get('origin_country', [])
                original_title = tmdb_details.get('original_title', '')
                popularity = tmdb_details.get('popularity', 0.0)
                production_countries = tmdb_details.get('production_countries', [])
                vote_count = tmdb_details.get('vote_count', 0)
                runtime = tmdb_details.get('runtime', 0)
                credits = fetch_tmdb_movie_credits(movie['id'])
                stills = fetch_tmdb_movie_stills(movie['id'])
                trailers = fetch_tmdb_movie_trailers(movie['id'])

                # 영화 데이터베이스에 저장
                movie_obj = Movie.objects.create(
                    title=title,
                    description=description,
                    release_date=release_date,
                    poster_url=poster_url,
                    rating=rating,
                    genres=genres,
                    origin_country=origin_country,
                    original_title=original_title,
                    popularity=popularity,
                    production_countries=production_countries,
                    vote_count=vote_count,
                    runtime=runtime,
                    stills=stills,
                    trailers=trailers,
                )

                if credits:
                    for cast_member in credits['cast']:
                        actor, actor_created = Actor.objects.update_or_create(
                            id=cast_member['id'],
                            defaults={
                                'name': cast_member.get('name', ''),
                                'gender': cast_member.get('gender', None),
                                'known_for_department': cast_member.get('known_for_department', ''),  # 수정된 부분
                                'popularity': cast_member.get('popularity', 0.0),
                                'profile_path': f"https://image.tmdb.org/t/p/w500{cast_member.get('profile_path', '')}",
                                'original_name': cast_member.get('original_name', ''),
                            }
                        )
                        MovieActor.objects.update_or_create(
                            movie=movie_obj,
                            actor=actor,
                            defaults={
                                'character': cast_member.get('character', ''),
                                'order': cast_member.get('order', 0),
                            }
                        )

    print('Successfully saved new TMDB movie data')

def normalize_title(title):
    return ''.join(title.lower().split())

def fetch_box_office_data():
    box_office_url = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json"
    params = {
        'key': settings.BOX_OFFICE_API_KEY,
        'targetDt': '20241120',  # 예시 날짜, 필요에 따라 변경
    }
    response = requests.get(box_office_url, params=params)
    if response.status_code == 200:
    
        return response.json().get('boxOfficeResult', {}).get('dailyBoxOfficeList', [])
    else:
        print(f"Failed to fetch box office data. Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    return None

def save_kobis_data():
    box_office_data = fetch_box_office_data()
    if not box_office_data:
        print("No box office data found.")
        return

    for entry in box_office_data:
        title = entry['movieNm'].strip().lower()  # KOBIS 제목을 소문자로 변환
        # 기존 영화 데이터 찾기
        movie = Movie.objects.filter(title__iexact=title).first()
        if movie:
            
            # KOBIS에서 가져온 박스오피스 데이터 업데이트
            movie.box_office_rank = entry.get('rank', None)
            movie.sales_amount = entry.get('salesAmt', 0)
            movie.sales_accumulate = entry.get('salesAcc', 0)
            movie.audience_cnt = entry.get('audiCnt', 0)
            movie.audience_accumulate = entry.get('audiAcc', 0)
            movie.save()

            print(f"Updated movie {title} ")
        else:
            print(f"Movie {title} not found in database")
    print('Successfully saved KOBIS movie data')

def save_youtube_reviews_data(start_id=1001, end_id=1100):
    # 특정 ID 범위에 해당하는 영화들만 선택
    movies = Movie.objects.filter(id__gte=start_id, id__lte=end_id)
    for movie in movies:
        query = f"{movie.title} 영화 리뷰"
        reviews = fetch_youtube_reviews(query)
        if reviews:
            movie.review_videoes = reviews  # 리뷰 URL을 JSON 필드에 저장
        movie.save()
    print(f'Successfully saved YouTube review data for movies with IDs from {start_id} to {end_id}')