from django.db import models
from django.conf import settings

class Golfer(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    club = models.ForeignKey('clubs.Club', on_delete=models.CASCADE, related_name='golfers')
    handicap = models.DecimalField(max_digits=4, decimal_places=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.full_name

    class Meta:
        ordering = ['last_name', 'first_name']
