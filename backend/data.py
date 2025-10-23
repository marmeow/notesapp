from typing import List
from models import Nota, Tag, Task


task_list: List[Task] = [
    Task(
        titol="Task example",
        tipus=Tag.PROJECT,
        deadline="Deadline 21 Dec",
        reminder="20 Dec, 9:00 AM",
        isSelected=True,
        isDone=False
    )
]



nota_list: List[Nota] = [
    Nota(
        titol="Brainstorming Session Highlights",
        preview="Capture your team's best ideas here.",
        tasks=task_list,
        hasTasks=True,
        numLinks=3,
        tags=Tag.PERSONAL,
        numTags=2,
        time="03:20 PM",
        notebook="NoteBook-01",
        hasAlarm=True,
        isShared=False,
        imgPreview="livingroom.jpg",
        isActive=False
    ),
    Nota(
        titol="Helping a local business",
        preview="Amet minim mollit non deserunt illemco est",
        tasks=task_list,
        hasTasks=True,
        numLinks=3,
        tags=Tag.PROJECT,
        numTags=2,
        time="11:24 AM",
        notebook="NoteBook-01",
        hasAlarm=False,
        isShared=False,
        imgPreview="livingroom2.jpg",
        isActive=False
    ),
    Nota(
        titol="Weekly Team Update",
        preview="Document this week's accomplishments, challenges",
        tasks=task_list,
        hasTasks=False,
        numLinks=0,
        tags=None,
        numTags=2,
        time="09:02 AM",
        notebook="NoteBook-01",
        hasAlarm=False,
        isShared=False,
        imgPreview=None,
        isActive=False
    ),
    Nota(
        titol="Streamline Your Workflow with a good environment",
        preview="In today's fast-paced environment we must",
        tasks=task_list,
        hasTasks=True,
        numLinks=3,
        tags=Tag.PERSONAL,
        numTags=2,
        time="10:20 AM",
        notebook="NoteBook-01",
        hasAlarm=True,
        isShared=True,
        imgPreview="livingroom.jpg",
        isActive=True
    ),
    Nota(
        titol="Client Meeting Notes",
        preview="Keep a record of all client interactions in one place",
        tasks=task_list,
        hasTasks=True,
        numLinks=3,
        tags=Tag.PERSONAL,
        numTags=2,
        time="04:53 AM",
        notebook="NoteBook-01",
        hasAlarm=False,
        isShared=False,
        imgPreview=None,
        isActive=False
    ),
    Nota(
        titol="Project Kickoff Plan",
        preview="Lay out the initial roadmap for your ner project.",
        tasks=task_list,
        hasTasks=True,
        numLinks=0,
        tags=Tag.PROJECT,
        numTags=0,
        time="10:43 AM",
        notebook="NoteBook-01",
        hasAlarm=False,
        isShared=False,
        imgPreview=None,
        isActive=False
    )
]


