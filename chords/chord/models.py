from django.db import models
import datetime
from django.utils import timezone
#from sources import *

class chordset(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    user
    created
    modified


class tuning:
    name = models.CharField(max_length=255)
    string1 = models.CharField(max_length=2, choices=NOTES)
    string2 = models.CharField(max_length=2, choices=NOTES)
    string3 = models.CharField(max_length=2, choices=NOTES)
    string4 = models.CharField(max_length=2, choices=NOTES)
    string5 = models.CharField(max_length=2, choices=NOTES)
    string6 = models.CharField(max_length=2, choices=NOTES)

    class Meta:
        unique_together = ('string1', 'string2', 'string3', 'string4', 'string5', 'string6')


class chord(models.Model):
    name = models.CharField(max_length=255)
    string1 = models.CharField(max_length=255)
    string2 = models.CharField(max_length=255)
    string3 = models.CharField(max_length=255)
    string4 = models.CharField(max_length=255)
    string5 = models.CharField(max_length=255)
    string6 = models.CharField(max_length=255)
    chordset
    tuning
    # src = models.CharField(max_length=25, choices=SRC_CHOICES)
    # src_id = models.CharField(max_length=255)
    # src_link = models.TextField()
    # title = models.CharField(max_length=255)
    # text = models.TextField()
    # pub_date = models.DateTimeField()
    # type = models.CharField(max_length=25, choices=TYPE_CHOICES)
    # entity = models.ForeignKey('Entity')
    # tags = models.ManyToManyField('Tag')
    # links = models.ManyToManyField('Link')

    class Meta:
        unique_together = ('src', 'src_id')
        get_latest_by = 'pub_date'
        ordering = ['-pub_date']



class AppMeta(models.Model):
    key = models.CharField(max_length=255, primary_key=True)
    value = models.TextField()


class Entity(models.Model):
    latest_date = models.DateTimeField()

    class Meta:
        get_latest_by = 'pub_date'


class Link(models.Model):
    link = models.TextField()
    def __unicode__(self):
        return self.link


class Tag(models.Model): # tags as the come
    tag = models.CharField(max_length=255, primary_key=True)
    super_tag = models.ForeignKey('SuperTag', related_name='super_tag')
    models.ForeignKey('SuperTag', related_name='super_tag')


class SuperTag(models.Model): # tags, lowercased
    tag = models.CharField(max_length=255, primary_key=True)


