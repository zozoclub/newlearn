#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import collections
import collections.abc


def main():
    # Python 3.10 이상에서 collections 모듈과 collections.abc 간의 호환성 문제 해결
    for name in ['Callable', 'Iterable', 'Iterator', 'Mapping', 'MutableMapping']:
        if not hasattr(collections, name):
            setattr(collections, name, getattr(collections.abc, name))

    """Run administrative tasks."""
    # Django 설정 모듈을 명시적으로 지정
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Crawling.settings')

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
