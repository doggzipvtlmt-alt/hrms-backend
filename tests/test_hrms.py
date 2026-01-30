from datetime import date, timedelta

def login(client, email, password):
    response = client.post(
        "/auth/login",
        data={"username": email, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def test_candidate_lifecycle(client, admin_user):
    token = login(client, admin_user.email, "password")

    response = client.post(
        "/candidates/",
        json={"full_name": "Jane Doe", "email": "jane@example.com", "position": "Engineer"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    candidate_id = response.json()["id"]

    response = client.post(
        f"/candidates/{candidate_id}/status",
        json={"status": "INTERVIEW_SCHEDULED"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "INTERVIEW_SCHEDULED"


def test_attendance_flags(client, hr_user):
    token = login(client, hr_user.email, "password")

    response = client.post(
        "/employees/",
        json={"full_name": "Sam Employee", "email": "sam@example.com", "position": "HR"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    employee_id = response.json()["id"]

    today = date.today()
    for days_ago in range(0, 3):
        response = client.post(
            "/attendance/mark",
            json={
                "employee_id": employee_id,
                "date": str(today - timedelta(days=days_ago)),
                "status": "ABSENT",
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 201

    response = client.get("/attendance/flags", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    payload = response.json()
    assert payload
    assert payload[0]["employee_id"] == employee_id
    assert payload[0]["flag"]
